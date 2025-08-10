export interface NotificationManagement<T = any> {
  templatePath?: string;

  sendMail?: (to: string, subject: string, message: string, config?: T) => Promise<boolean>;
  createSubscriber?: (data: NotificationSubscriber) => Promise<string | undefined>;
  updateSubscriber?: (data: NotificationSubscriber) => Promise<boolean>;
  createSubscribeList?: (title: string) => Promise<boolean>;
  addSubscriberToList?: (subscriberId: string[], listKey: string) => Promise<boolean>;
  notify?: <BuildMessage>(data: BuildMessage) => Promise<boolean>;
}

export interface NotificationSubscriber {
  subscriberId?: string;
  recordId?: string;
  user_uuid: string;
  user_id: number;
  email?: string;
  full_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
}
