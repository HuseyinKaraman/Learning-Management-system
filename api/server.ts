import { app } from "./app";
import { PORT } from "./constants/environment.ts";


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
