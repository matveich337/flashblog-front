import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

export default function AccountActivationPage() {
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const handleSignInRedirect = () => routeChange("/login");

  useEffect(() => {
    fetchActivateAccount();
  }, []);

  const params = useParams();

  const fetchActivateAccount = () => {
    fetch(
      `http://localhost:8080/api/accounts/email/activation/${params.activationToken}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    ).then((response) => {
      if (!response.ok) {
        response.json().then(() => {
          toast(`Not valid activation link`, {
            progressClassName: "red-progress",
          });
        });
      } else {
        toast(`Account activated succesfully`);
      }
      handleSignInRedirect();
    });
  };

  return;
}
