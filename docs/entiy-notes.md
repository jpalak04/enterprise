**Backstage Catalog System Overview**

1. **Processing Loop**: Backstage employs a processing loop mechanism to keep the catalog updated. This loop takes in raw entity data and outputs a refined version for the catalog. The cycle consists of reading, processing, and stitching.

   - **Reading**: This phase extracts raw data from locations registered with the catalog. It might involve pulling data from sources like GitHub or Kubernetes.
   - **Processing**: The read data undergoes parsing, validation, and transformation. Plugins can extend the default processing logic.
   - **Stitching**: This merges all the outputs from previous steps into the final object, ensuring it remains updated, especially in relation to the search table for the catalog API.

2. **Error Handling**: Errors can emerge during ingestion and processing. These are either logged for operators to debug or flagged in the entity status for users to address.

3. **Orphaning**: Entities form a graph. When a parent entity stops emitting a child entity, the child may become orphaned. Orphaned entities aren't deleted but are flagged. However, automatic deletion can be configured.

4. **Entity Deletion**:
   - **Implicit Deletion**: Entity providers may trigger deletions. Deleting a "root" entity can result in all its child entities being deleted.
   - **Explicit Deletion**: Entities can be directly deleted via the catalog API. However, if a parent entity is still active, the deleted entity might reappear.

5. **Entity Providers**: These feed entities into the catalog, managing a private "bucket" of entities. They can initialize, observe, and interact with the catalog's entities, ensuring its consistency and currency.
