import { createContext, useContext, useState } from "react";
import { Modal, Platform, Share } from "react-native";
import TeamInvationPage from "../pages/Teams/TeamInvationPage";

const ShareContext = createContext();
export const useShare = () => useContext(ShareContext);

export const ShareProvider = ({ children }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [shareCallback, setShareCallback] = useState(() => () => {});
  const [shareUrl, setShareUrl] = useState("");
  const [isCustomShare, setIsCustomShare] = useState(false);

  const shareProfile = async (options, customShare = Platform.OS == "ios") => {
    try {
      const user = options.user;
      const url = `${process.env.EXPO_PUBLIC_API_HOST}share/${options.type}/${options.id}`;
      const message = `
      🔹 Профиль пользователя 🔹
      
      👤 Имя: ${user.name} ${user.surname}
      📞 Телефон: ${user.phone}
      📧 Email: ${user.email}
      📝 Постов: ${user.posts?.length ?? 0}
      
      Загляни и узнай больше: ${url}
      `.trim();

      const shareOptions = {
        message,
      };

      setShareUrl(url);
      setShareCallback(() => async () => await Share.share(shareOptions));
      setIsShowModal(true);
      setIsCustomShare(customShare);
    } catch (error) {
      console.error("shareProfile:", error);
    }
    return;
  };

  const sharePost = async (options, customShare = Platform.OS == "ios") => {
    try {
      const { id, name, full_address, city, price, text } = options;
      const url = `${process.env.EXPO_PUBLIC_API_HOST}share/post/${id}`;

      const postName = name ? name : "Объявление";
      const address = full_address
        ? `📍 Адрес: ${full_address}, ${city}`
        : `🏙 Город: ${city}`;
      const priceInfo = price ? `💰 Цена: ${price} руб.` : "";
      const description = text ? text : "Описание отсутствует";

      const message = `
      🏡 ${postName}
      ${address}
      ${priceInfo}
      📄 Описание: ${description}
      🔗 Посмотри это объявление: ${url}
      `;

      const shareOptions = {
        message,
      };

      setShareUrl(url);
      setShareCallback(() => async () => await Share.share(shareOptions));
      setIsShowModal(true);
      setIsCustomShare(customShare);
    } catch (error) {
      console.error("sharePost:", error);
    }
  };

  return (
    <ShareContext.Provider
      value={{
        sharePost,
        shareProfile,
        isShowModal,
        setIsShowModal,
        shareUrl,
        shareCallback,
        isCustomShare,
      }}
    >
      {children}
      <Modal
        visible={!isCustomShare && isShowModal}
        onRequestClose={() => setIsShowModal(false)}
      >
        <TeamInvationPage
          shareUrl={shareUrl}
          shareCallback={shareCallback}
          handleClose={() => setIsShowModal(false)}
        />
      </Modal>
    </ShareContext.Provider>
  );
};
