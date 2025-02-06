export type Task = {
  id: number;
  label: string;
  done: boolean;
};

export type UserInfo = {
  id: string;
  name: string;
  icon: string;
};

export type AuthHeader = {
  authorization: string;
};

export type ArticleInfo = {
  id: number;
  title: string;
  body: string;
};
