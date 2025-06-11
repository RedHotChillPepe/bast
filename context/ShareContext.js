import { createContext, useContext, useState } from "react";
import { Modal, Share } from "react-native";
import TeamInvationPage from "../pages/Teams/TeamInvationPage";

const ShareContext = createContext();
export const useShare = () => useContext(ShareContext);

export const ShareProvider = ({ children }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [shareCallback, setShareCallback] = useState(() => () => {});
  const [shareUrl, setShareUrl] = useState("");

  const shareProfile = async (options) => {
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
    } catch (error) {
      console.error("shareProfile:", error);
    }
    return;
  };

  const sharePost = async (options) => {
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
    } catch (error) {
      console.error("sharePost:", error);
    }
  };

  return (
    <ShareContext.Provider value={{ sharePost, shareProfile }}>
      {children}
      <Modal visible={isShowModal} onRequestClose={() => setIsShowModal(false)}>
        <TeamInvationPage
          shareUrl={shareUrl}
          shareCallback={shareCallback}
          handleClose={() => setIsShowModal(false)}
        />
      </Modal>
    </ShareContext.Provider>
  );
};
