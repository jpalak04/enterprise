## TLS For Ingress
Need to create a cert to allow TLS for browser access

### Create your Key and Cert


```bash
openssl genrsa -out key.pem 2048
#The first OpenSSL command generates a 2048-bit (recommended) RSA private key.
openssl req -new -sha256 -key key.pem -out csr.csr
#The second command generates a Certificate Signing Request, which you could instead use to generate a CA-signed certificate. This step will ask you questions; be as accurate as you like since you probably aren’t getting this signed by a CA.
openssl req -x509 -sha256 -days 365 -key key.pem -in csr.csr -out certificate.pem
#The third command generates a self-signed x509 certificate suitable for use on web servers. 
```
### Store the Secret for the TLS Cert and Key
```bash

kubectl create secret tls developer-portal-tls --cert=certificate.pem --key=key.pem
```
## Setup Database Secret to match what you want
```bash
kubectl create secret generic postgres-credentials \
--from-literal=POSTGRES_USER=<replace> \
--from-literal=POSTGRES_PASSWORD=<replace>
```

## Verify NFS Storage Class

The persistent volume claim is required for Postgres in DEV and needs to be able to change ownership of the filesystem.

Be sure the no_root_squash flag is set on the master node for the NFS server:

Check your /etc/exports file and make sure **no_root_squash** is set
```
# Should look similar to this
/nfs  10.129.144.88(rw,sync,no_subtree_check,no_root_squash)
```
Reload Config
```bash
exportfs -ra
```

## ADD TLS for Flux Controller to trust Artifactory
```bash
kubectl create secret generic artifactory-ca --from-file=ca.crt=<(echo -n | openssl s_client -connect artifactory-phx.ecd.axway.int:443 | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p') -n ce-developer-portal
```
