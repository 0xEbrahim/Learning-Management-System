export interface ICheckoutBody {
  courseId: string;
  userId: string;
}

export interface IWebhookBody {
  req: any;
}

export interface IGetOrderBody {
  orderId: string;
  userId: string;
}

export interface IGetAllOrders {
  query: Record<string, any>;
  userId?: string;
  authUser: string;
}
