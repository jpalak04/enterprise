# Rotate Certs for Artifactory
In the event that the certificates for the helm repo get rotated, you might be an x509 error in the HelmRelease Controller for Flux
```bash
echo | openssl s_client -showcerts -servername artifactory-phx.ecd.axway.int -connect artifactory-phx.ecd.axway.int:443 > cacert.pem
cat cacert.pem | base64 | tr -d '\n' > encoded-cacert.txt
# Take the content from the encoded txt and paste it into the secret manifest
# eg, clusters/self-service-portal-dev/artifactory-ca-secret.yaml
# if you require AxwayRoot, take the exported CA root and encode
 base64 AxwayRootCA.cer | tr -d '\n'
# Capture the encoded text to paste into secret section for ca-root
```
# Flux trouble shooting

Brute force: get information about everything
```
# set your kubectx first
flux get all -A
flux events -A
```

# force update to helm release controller
This is helpful if you need to rotate certs or are having issues with Artifactory connectivity
```
flux reconcile source helm ce-developer-portal-helm-release --namespace ce-developer-portal
flux reconcile source helm ce-developer-portal-helm-snapshots --namespace ce-developer-portal
```

[Link to Cheatsheet for other items](https://fluxcd.io/flux/cheatsheets/troubleshooting/)