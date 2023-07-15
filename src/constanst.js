export const collectionsAndDocumentNameMongo = {
  shop: {
    DOCUMENT_NAME: "shop",
    COLLECTION_NAME: "shops",
  },
  keyToken: {
    DOCUMENT_NAME: "keyToken",
    COLLECTION_NAME: "keyTokens",
  },
  apiKey: {
    DOCUMENT_NAME: "apiKey",
    COLLECTION_NAME: "apiKeys",
    ENUMS: ["0000", "1111", "2222"],
  },
  product: {
    DOCUMENT_NAME: "product",
    COLLECTION_NAME: "products",
    ENUMS: ["electronics", "clothings", "furniture"],
  },
  clothing: {
    DOCUMENT_NAME: "clothing",
    COLLECTION_NAME: "clothings",
    NAME: "clothings",
  },
  electronic: {
    DOCUMENT_NAME: "electronic",
    COLLECTION_NAME: "electronics",
    NAME: "electronics",
  },
  inventory: {
    DOCUMENT_NAME: "inventory",
    COLLECTION_NAME: "inventorys",
  },
  discount: {
    DOCUMENT_NAME: "discount",
    COLLECTION_NAME: "discounts",
    DISCOUNT_APPLIES_TO_ENUMS: ["all", "specific"],
  },
};

export const rolesShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDIT: "EDIT",
  ADMIN: "ADMIN",
};

export const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESH_TOKEN: "refreshtoken",
};
