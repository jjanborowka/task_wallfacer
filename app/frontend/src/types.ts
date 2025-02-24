interface DataEntry {
    sum: string;   // Keeping as string since it's quoted in the JSON
    count: string; // Keeping as string since it's quoted in the JSON
    day_of_week: number;
  }
  
 export interface ApiResponse {
    data: DataEntry[];
  }
  