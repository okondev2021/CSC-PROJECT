export interface FeedbackItem {
  id: string;
  category: string;
  message: string;
  status: "pending" | "resolved";
  created_at: string;
}
