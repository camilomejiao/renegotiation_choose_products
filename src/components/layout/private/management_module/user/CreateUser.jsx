import { useCreateUserForm } from "./model/useCreateUserForm";
import { CreateUserView } from "./ui/CreateUserView";

export const CreateUser = () => {
  const createUserForm = useCreateUserForm();

  return <CreateUserView {...createUserForm} />;
};
