import React, { createContext, useContext, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { getAuth } from '../utils/authUtils'

const ApiContext = createContext()
const host = process.env.EXPO_PUBLIC_API_HOST

export default function ApiProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      return setAccessToken(await getAuth())
    }
    fetchToken()
  }, [accessToken]);

  const getAllPosts = async () => {
    const url = `${host}api/posts`
    console.log(url);

    return fetch(url, { headers: { "Authorization": `Bearer ${accessToken}` } })
      .then(response => response.json()
      )
      .then(json => { return json }
      )
      .catch(error => {
        console.error("Error fetching all posts: ", error);
      })
  }

  const getManyPosts = async (data) => {
    const url = `${host}api/posts/manyPosts`;
    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error getting user: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  const getPaginatedPosts = async (page, params) => {
    // Формируем строку запроса с параметрами
    if (!accessToken) return
    const query = new URLSearchParams({
      ...params, // Передаем все параметры
      page, // Добавляем параметр страницы
    }).toString();
    console.log("Paginated query: ", query);

    // Формируем URL с query параметрами
    const url = `${host}api/posts?${query}`;
    console.log(url);
    try {
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }

      // Возвращаем результат
      return await response.json();
    } catch (error) {
      console.error("Error fetching posts: ", error);
      Alert.alert("Error", "Network Error");
    }
  };

  const getPost = async (id) => {
    const url = `${host}api/posts?id=${id}`;

    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      })
        .then(async (response) => {
          return await response.json();
        })
        .catch((error) => {
          console.error("Error getting user: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getVillage = async (id) => {
    const url = `${host}api/villages/${id}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`${data.message}`);
      }

      // console.log(data);
      if (data.success) {
        return data; // Возвращаем данные о поселке
      }

      throw new Error(data.message || 'Неизвестная ошибка');

    } catch (error) {
      console.error(error.message);
      throw error; // Передаем ошибку дальше для обработки
    }
  };

  const getUserPostsByStatus = async (user_id, status_int) => {
    const url = `${host}api/posts/getUserPostsByStatus?user_id=${user_id}&post_status=${status_int}`;

    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error getting posts: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const sendPost = async (data) => {
    const url = `${host}api/posts/newpost`;

    // Функция для извлечения числового значения из объекта (если нужно)
    const getNumericValue = (field) => {
      if (field && typeof field === 'object') {
        return Number(field.value);
      }
      return field;
    };


    const uploadData = JSON.stringify({
      name: data.title === "" ? null : data.title,
      house_type: data.houseType === "" ? null : (typeof data.houseType === 'object' ? data.houseType.value : data.houseType),
      walls_lb: data.wallMaterial === "" ? null : (typeof data.wallMaterial === 'object' ? data.wallMaterial.value : data.wallMaterial),
      walls_part: data.partitionMaterial === "" ? null : (typeof data.partitionMaterial === 'object' ? data.partitionMaterial.value : data.partitionMaterial),
      price: data.price === "" ? null : data.price,
      house_area: data.area === "" ? null : getNumericValue(data.area),
      num_floors: data.floors === "" ? null : getNumericValue(data.floors),
      bedrooms: data.rooms === "" ? null : getNumericValue(data.rooms),
      full_address: data.location === "" ? null : data.location,
      city: data.settlement === "" ? null : data.settlement,
      plot_area: data.plotSize === "" ? null : getNumericValue(data.plotSize),
      text: data.description === "" ? null : data.description,
      roof: data.roof === "" ? null : (typeof data.roof === 'object' ? data.roof.value : data.roof),
      base: data.basement === "" ? null : (typeof data.basement === 'object' ? data.basement.value : data.basement),
      kad_number: data.kadastr === "" ? null : data.kadastr,
      house_status: data.houseCondition === "" ? null : data.houseCondition,
      year_built: data.constructionYear === "" ? null : getNumericValue(data.constructionYear),
      gas: data.gas === "" ? null : data.gas,
      water: data.water === "" ? null : data.water,
      sewage: data.sewerege === "" ? null : data.sewerege,
      electricity_bill: data.electricity === "" ? null : data.electricity,
      heating: data.heating === "" ? null : data.heating,
      photos: data.photos,
      poster_id: data.poster_id,
      latitude: data.lat === "" ? null : data.lat,
      longitude: data.lon === "" ? null : data.lon,
      usertype: data.usertype,
    })

    console.log("data:", uploadData);
    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: uploadData,
      })
        .then((response) => {
          return response
        }
        )
        .catch((error) => {
          console.error("Error executing query ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };


  const updatePost = async (data, id) => {
    const url = `${host}api/posts/updatepost`;
    // [ ] TODO: доделать обновление поста
    const formData = JSON.stringify(
      {
        id: data.id,
        name: data.title == "" ? null : data.title,
        house_type: data.houseType == "" ? null : data.houseType,
        walls_lb: data.wallMaterial == "" ? null : data.wallMaterial,
        walls_part:
          data.partitionMaterial == "" ? null : data.partitionMaterial,
        price: data.price == "" ? null : data.price,
        house_area: data.area == "" ? null : data.area,
        num_floors: data.floors == "" ? null : data.floors,
        bedrooms: data.rooms == "" ? null : data.rooms,
        full_address: data.location == "" ? null : data.location,
        city: data.settlement == "" ? null : data.settlement,
        plot_area: data.plotSize == "" ? null : data.plotSize,
        text: data.description == "" ? null : data.description,
        roof: data.roof == "" ? null : data.roof,
        base: data.basement == "" ? null : data.basement,
        /* landArea: '', */
        kad_number: data.kadastr == "" ? null : data.kadastr,
        house_status:
          data.houseCondition == "" ? null : data.houseCondition,
        year_built:
          data.constructionYear == "" ? null : data.constructionYear,
        gas: data.gas == "" ? null : data.gas,
        water: data.water == "" ? null : data.water,
        sewage: data.sewerege == "" ? null : data.sewerege,
        electricity_bill: data.electricity == "" ? null : data.electricity,
        heating: data.heating == "" ? null : data.heating,
        photos: data.photos,
      },
    );

    console.log(formData);

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: formData
      })
        .then(async (response) => {
          return await response.json();
        })
        .catch((error) => {
          console.error("Error getting user: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (value) => {
    const url = `${host}api/posts/update-status`;

    const { post_id, post_status } = value;

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          post_id,
          post_status,
        }),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error updating status: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllVillages = async () => {
    const url = `${host}api/villages/all`;
    console.log(url);

    return fetch(url, { headers: { "Authorization": `Bearer ${accessToken}` } })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error("Error fetching villages: ", error);
      });
  };

  const postRegister = async (data) => {
    const url = `${host}api/users/newuser`;
    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([data]),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error posting user: ", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getLogin = async (phone, password) => {
    const url = `${host}api/auth/login`;

    const requestData = {
      phone,
      password,
    };

    console.log("Request Data:", JSON.stringify(requestData)); // Логируем данные для отладки

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // Отправляем данные как объект, а не массив
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Получаем тело ошибки, если она произошла
        throw new Error(errorResponse.message || 'Неизвестная ошибка');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };


  const getUser = async (phone, query) => {
    const url =
      `${host}api/users/getuser${query != undefined ? `?user=${query}` : ""}`;

    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

        },
        body: JSON.stringify([
          {
            phone,
          },
        ]),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error getting user: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserStatus = async (userId, usertype, newStatus) => {
    const url = `${host}api/users/update`

    try {
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          usertype,
          newStatus
        })
      })
        .then(response => { return response })
        .catch(error => {
          console.error("Error updating user: ", error);
          Alert.alert("Error", "Network Error")
        })
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  }

  const getCompanyByName = async (companyName) => {
    const url = `${host}api/users/getcompany/${companyName}`;
    console.log(url);
    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error getting company: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  const updateUser = async (userObject) => {
    const url = `${host}api/users/update`

    const updateData = JSON.stringify({
      id: userObject.id,
      usertype: userObject.usertype,
      phone: userObject.phoneNumber,
      name: userObject.name,
      surname: userObject.surname,
      email: userObject.email,
      photo: userObject.photo
    })

    console.log("updateData:", updateData);

    try {
      return fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`
        },
        body: updateData
      })
        .then(response => {
          return response
        })
        .catch(error => {
          console.error("Error updating user: ", error);
          Alert.alert("Error", "Network Error")
        })
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network Error")
    }
  }

  const getUserByID = async (id, usertype, phone) => {
    const query = new URLSearchParams({
      id,
      type: usertype || "user",
      ...(phone && { phone }) // если передан phone — добавим его
    }).toString();

    const url = `${host}api/users/getuser?${query}`;
    console.log("GetUser URL:", url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error("Error getting user: ", error);
    }
  };

  const getIsOwner = async (postId, userId) => {
    const url = `${host}api/users/getisowner`;

    const params = new URLSearchParams({
      post_id: Number(postId).toString(),
    });

    if (userId !== undefined) {
      params.append('user_id', userId.toString());
    }

    try {
      return fetch(`${url}?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      })
        .then((response) => response)
        .catch((error) => {
          console.error("Error getting user ownership: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };


  const sendSms = async (phone) => {
    const url = `${host}api/sms/sendsms`;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            phone,
          },
        ),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error getting user: ", error);
        });
    } catch (error) {
      console.error("Error sending Sms: ", error);
    }
  };

  const verifySms = async (phone, code) => {
    const url = `${host}api/sms/verify-code`;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            phone,
            code,
          },
        ),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error getting user: ", error);
        });
    } catch (error) {
      console.error("Error sending Sms: ", error);
    }
  }

  const changePhone = async (phone, userId, usertype) => {
    const url = `${host}api/sms/changephone`

    const data = JSON.stringify({
      phone,
      userId,
      userType: usertype
    });

    console.log(data);

    try {
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`,
        },
        body: data
      })
        .then(response => { return response })
        .catch(error => {
          console.error("Error: ", error);
        })
    } catch (error) {
      console.error("Error sending Sms: ", error);
    }

  }

  const getCurrentUser = async () => {
    const url = `${host}api/auth/me`

    try {
      return fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`
        },
      })
        .then(async response => { return await response.json() })
        .catch(error => {
          console.error("Error: ", error);
        })
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  }

  const registerUser = async (formData) => {
    const url = `${host}api/auth/register`

    try {
      if (!formData) throw new Error("Заполнены не все поля");

      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
        .then(response => { return response })
        .catch(error => {
          console.error("Error: ", error);
        })
    } catch (error) {
      console.log(error);
    }
  }

  const checkPhone = (phoneNumber) => {
    const url = `${host}api/sms/check-phone`;

    try {
      if (!phoneNumber) throw new Error("Номер телефона обязателен");

      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })
        .then(response => response.json())
        .catch(error => {
          console.error("Ошибка при проверке номера: ", error);
          throw error;
        });
    } catch (error) {
      console.log("Ошибка:", error);
      throw error;
    }
  };


  return (
    <ApiContext.Provider value={{
      getAllPosts, getPaginatedPosts, getAllVillages,
      getLogin, getUser, updateUser, getCompanyByName, getIsOwner, postRegister, sendSms, verifySms, changePhone,
      getPost, getVillage, getManyPosts, getUserPostsByStatus, getUserByID, sendPost, updatePost, updateStatus,
      updateUserStatus, getCurrentUser, registerUser, checkPhone
    }}>
      {children}
    </ApiContext.Provider>
  )

}


export const useApi = () => useContext(ApiContext)
