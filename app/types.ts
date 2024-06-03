type addCollectionAdditionalData = {
  reset_data? : boolean
}

export type RootStackParamList = {
  Login: { email: string };
  SignUp: { email?: string };
  ForgotPassWord: { email: string };
  '(tabs)': { creator_id: string };
  Profile: { creator_id: string};
  Notification: { creator_id: string };
  Home: { creator_id: string };
  Collections: { creator_id: string };
  CollectionProducts: { creator_id: string; collection_id: string };
  ProductDetails: { creator_id: string; product_id: string };
  '+not-found': {};
  AddProducts: { creator_id: string };
  AddSingleProduct: { creator_id: string },
  AddCollection: { creator_id: string}
  CollectionDetails: { creator_id: string, collection_id: string }
};
