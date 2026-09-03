export type RootStackParamList = {
  BottomTab: undefined;
  FeedbackMenu: undefined;
  FieldReport: undefined;
  AdminProcedure: undefined;
  FeedbackMap: undefined;
  CitizenReception: undefined;
  CreateReport: { type?: 'field' | 'admin' } | undefined;
  ReportDetail: { id?: string } | undefined;
  Login: undefined;
  Register: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Messages: undefined;
  Community: undefined;
  Notifications: undefined;
  Account: undefined;
};
