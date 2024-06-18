import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function RecipeEditor() {
  const params = useSearchParams();

  const axios = useContext(axiosContext);

  return <><div>test</div></>;
}

export default RecipeEditor;
