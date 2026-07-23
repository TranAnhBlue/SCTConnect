export type RootStackParamList = {
  BottomTab: undefined;
  FeedbackMenu: undefined;
  FieldReport: undefined;
  AdminProcedure: undefined;
  FeedbackMap: undefined;
  CreateReport: { type: 'field' | 'admin' };
  ReportDetail: { id: string };
};

export type BottomTabParamList = {
  Home: undefined;
  Messages: undefined;
  Community: undefined;
  Notifications: undefined;
  Account: undefined;
};
