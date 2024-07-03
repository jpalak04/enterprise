import React, { useState, useEffect } from 'react';
import { useApi, configApiRef, discoveryApiRef} from '@backstage/core-plugin-api';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Container, Box } from '@material-ui/core';

export const DeploymentFromConfig = () => {
  const configApi = useApi(configApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const [product, setProduct] = useState('');
  const [awsAccount, setAwsAccount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<string[]>([]);
  const [awsAccounts, setAwsAccounts] = useState<AwsAccount[]>([]);  
  interface AwsAccount {
    value: string;
    label: string;
  }
  useEffect(() => {
    // Load product and AWS account options from config
    const loadedProducts = configApi.getOptionalConfigArray('ceDeployment.products')?.map(cfg => cfg.getString('value')) || [];
    const loadedAwsAccounts = configApi.getOptionalConfigArray('ceDeployment.awsAccounts')?.map(cfg => ({
      value: cfg.getString('value'),
      label: cfg.getOptionalString('label') || cfg.getString('value'), // Use value as fallback if label isn't provided
    })) || [];
  
    console.log('ceDeployment config:', configApi.getOptional('ceDeployment'));

    setProducts(loadedProducts);
    setAwsAccounts(loadedAwsAccounts);
  }, [configApi]); // Re-run if configApi changes
  
  const handleProductChange = (event: any) => {
    setProduct(event.target.value);
  };

  const handleAwsAccountChange = (event: any) => {
    setAwsAccount(event.target.value);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
  
    // Check if a file is selected
    if (!file) {
      alert('Please select a file first.');
      return;
    }
  
    const formData = new FormData();
    console.log("File Info "+ file);
    formData.append('file', file); // 'file' is the key expected by multer in the backend
    formData.append('awsAccount', awsAccount);

    try {
      // Adjust the fetch URL to match your backend plugin's route
      const url = `${await discoveryApi.getBaseUrl('s3fileuploader')}/upload`;

      console.log("Calling Post on "+url);

      console.log(formData);
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData, 
        // Send the form data with the file
        // Note: When sending FormData, the 'Content-Type' header should not be set manually
        // so the browser can set the boundary parameter of the content type automatically
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful', result);
        alert('File uploaded successfully');
      } else {
        // Handle server errors or invalid responses
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        alert('Upload failed: ' + errorText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };
  
  return (
    <Box display="flex" justifyContent="flex-start" ml={5}>
    <Container maxWidth="sm"> 
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <FormControl fullWidth margin="normal">
        <InputLabel id="product-select-label">Product</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          value={product}
          onChange={handleProductChange}
        >
          {products.map((prod) => (
            <MenuItem key={prod} value={prod}>{prod}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="aws-account-select-label">AWS Account</InputLabel>
        <Select
          labelId="aws-account-select-label"
          id="aws-account-select"
          value={awsAccount}
          onChange={handleAwsAccountChange}
        >
          {awsAccounts.map((account) => (
            <MenuItem key={account.value} value={account.value}>{account.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {file && <TextField fullWidth margin="normal" variant="outlined" disabled value={file.name} />}
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
    </Container>
    </Box>
  );
};