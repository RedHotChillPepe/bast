import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";
import ProfileCompanyPage from "./ProfileCompanyPage.js";
import ProfileRealtorPage from "./ProfileEmployeePage.js";
import UserProfilePage from "./UserProfilePage.js";

const ProfilePage = ({ route }) => {
  const { getAuth } = useAuth();
  const navigation = useNavigation();
  const { getUser, getCurrentUser } = useApi();

  const [usertype, setUsertype] = useState();

  const [user, setUser] = useState([]);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser)
        return navigation.navigate("Error", {
          messageProp: "Ошибка! Не удалось загрузить профиль",
        });
      setUser(currentUser);
      setUsertype(currentUser.usertype);
    };
    init();
  }, [usertype, getAuth, getUser]);

  useEffect(() => {
    if (route.params?.updatedUser) {
      setUser((prevUser) => ({
        ...prevUser,
        ...route.params.updatedUser,
        photo:
          route.params.updatedUser.photo !== null
            ? route.params.updatedUser.photo
            : prevUser.photo,
      }));
    }
  }, [route.params?.updatedUser]);

  if (!usertype) {
    return <Loader />;
  }

  switch (usertype) {
    case 2:
      return <ProfileCompanyPage user={user} />;
    case 3:
      return <ProfileRealtorPage user={user} />;
    case 1:
      return <UserProfilePage user={user} setUser={setUser} />;
  }
};

export default ProfilePage;
