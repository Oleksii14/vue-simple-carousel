export interface IDotsData {
  margin?: string;
  padding?: string;
  alignment?: "center" | "end" | "start";
  dots?: {
    circled?: boolean;
    size?: number;
    color?: string;
    border?: string;
    spacing: number;
  }
}