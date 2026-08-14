export type TLineProfile = {
  displayName: string | null;
  pictureUrl: string | null;
};

export interface ILineMessagingGateway {
  pushText(lineUserId: string, content: string): Promise<void>;
  fetchProfile(lineUserId: string): Promise<TLineProfile | null>;
}
