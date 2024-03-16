import Button from "components/Button";
import { Path, useNavigate } from "router";

type BackLinkProps = {
  to: Path;
};

export default function BackLink(props: BackLinkProps) {
  const navigate = useNavigate();

  return (
    <Button
      color="gray"
      text="← Go Back"
      onClick={() => navigate(props.to)}
    />
  );
}
