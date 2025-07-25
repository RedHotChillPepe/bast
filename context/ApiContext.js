import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { getAuth } from "../utils/authUtils";

const ApiContext = createContext();
const host = process.env.EXPO_PUBLIC_API_HOST;

export default function ApiProvider({ children }) {
  const getAllPosts = async () => {
    const accessToken = await getAuth();
    const url = `${host}api/posts`;

    return fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error("Error fetching all posts: ", error);
      });
  };

  const getManyPosts = async (postIds) => {
    const accessToken = await getAuth();

    const postIdsStr = postIds.join(",");

    const url = `${host}api/posts/many?post_ids=${postIdsStr}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Error getting posts: ", error);
    }
  };

  const getPaginatedPosts = async (page, params) => {
    const accessToken = await getAuth();
    // Формируем строку запроса с параметрами
    if (!accessToken) return;
    const query = new URLSearchParams({
      ...params, // Передаем все параметры
      page, // Добавляем параметр страницы
    }).toString();
    console.log(params);

    // Формируем URL с query параметрами
    const url = `${host}api/posts?${query}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка: ${response.status} ${errorText}`);
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
    const accessToken = await getAuth();
    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
    const accessToken = await getAuth();
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`${data.message}`);
      }

      if (data.success) {
        return data; // Возвращаем данные о поселке
      }

      throw new Error(data.message || "Неизвестная ошибка");
    } catch (error) {
      console.error(error.message);
      throw error; // Передаем ошибку дальше для обработки
    }
  };

  const getUserPostsByStatus = async (user_id, status_int) => {
    const url = `${host}api/posts/getUserPostsByStatus?user_id=${user_id}&post_status=${status_int}`;
    const accessToken = await getAuth();
    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    const accessToken = await getAuth();
    // Функция для извлечения числового значения из объекта (если нужно)
    const getNumericValue = (field) => {
      if (field && typeof field === "object") {
        return Number(field.value);
      }
      return field;
    };

    const uploadData = JSON.stringify({
      name: data.title === "" ? null : data.title,
      house_type:
        data.houseType === ""
          ? null
          : typeof data.houseType === "object"
          ? data.houseType.value
          : data.houseType,
      walls_lb:
        data.wallMaterial === ""
          ? null
          : typeof data.wallMaterial === "object"
          ? data.wallMaterial.value
          : data.wallMaterial,
      walls_part:
        data.partitionMaterial === ""
          ? null
          : typeof data.partitionMaterial === "object"
          ? data.partitionMaterial.value
          : data.partitionMaterial,
      price: data.price === "" ? null : data.price,
      house_area: data.area === "" ? null : getNumericValue(data.area),
      num_floors: data.floors === "" ? null : getNumericValue(data.floors),
      bedrooms: data.rooms === "" ? null : getNumericValue(data.rooms),
      full_address: data.location === "" ? null : data.location,
      city: data.settlement === "" ? null : data.settlement,
      plot_area: data.plotSize === "" ? null : getNumericValue(data.plotSize),
      text: data.description === "" ? null : data.description,
      roof:
        data.roof === ""
          ? null
          : typeof data.roof === "object"
          ? data.roof.value
          : data.roof,
      base:
        data.basement === ""
          ? null
          : typeof data.basement === "object"
          ? data.basement.value
          : data.basement,
      kad_number: data.kadastr === "" ? null : data.kadastr,
      house_status: data.houseCondition === "" ? null : data.houseCondition,
      year_built:
        data.constructionYear === ""
          ? null
          : getNumericValue(data.constructionYear),
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
    });

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: uploadData,
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error executing query ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = async (data, id) => {
    const url = `${host}api/posts/updatepost`;
    const accessToken = await getAuth();

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
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
    const accessToken = await getAuth();
    const { post_id, post_status } = value;

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

    const accessToken = await getAuth();
    return fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
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
    } catch (error) {}
  };

  const getLogin = async (phone, password) => {
    const url = `${host}api/auth/login`;
    console.log(url);

    const requestData = {
      phone,
      password,
    };

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
        throw new Error(errorResponse.message || "Неизвестная ошибка");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getUser = async (phone, query) => {
    const url = `${host}api/users/getuser${
      query != undefined ? `?user=${query}` : ""
    }`;

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
    const url = `${host}api/users/update`;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          usertype,
          newStatus,
        }),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error updating user: ", error);
          Alert.alert("Error", "Network Error");
        });
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  const getCompanyByName = async (companyName) => {
    const url = `${host}api/users/getcompany/${companyName}`;

    const accessToken = await getAuth();
    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
  };

  const updateUser = async (userObject) => {
    const url = `${host}api/users/update`;
    const accessToken = await getAuth();
    const updateData = JSON.stringify({
      phone: userObject.phoneNumber,
      name: userObject.name,
      surname: userObject.surname,
      email: userObject.email,
      photo: userObject.photo,
    });

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: updateData,
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error updating user: ", error);
          Alert.alert("Error", "Network Error");
        });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network Error");
    }
  };

  const getUserByID = async (id, usertype, phone) => {
    const query = new URLSearchParams({
      id,
      type: usertype || "user",
      ...(phone && { phone }), // если передан phone — добавим его
    }).toString();
    const accessToken = await getAuth();
    const url = `${host}api/users/getuser?${query}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    const accessToken = await getAuth();
    if (userId !== undefined) {
      params.append("user_id", userId.toString());
    }

    try {
      return fetch(`${url}?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

  const sendSms = async (phone, purpose) => {
    const url = `${host}api/sms/sendsms`;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          purpose,
        }),
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

  const verifySms = async (phone, code, token) => {
    const url = `${host}api/sms/verify-code`;
    const accessToken = token ? token : await getAuth();
    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          phone,
          code,
        }),
      })
        .then(async (response) => {
          const json = await response.json();
          console.log(json);
          if (!response.ok) throw json;
          return json;
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      throw error;
    }
  };

  const changePhone = async (phone, userId, usertype) => {
    const url = `${host}api/sms/changephone`;

    const data = JSON.stringify({
      phone,
      userId,
      userType: usertype,
    });

    const accessToken = await getAuth();
    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    } catch (error) {
      console.error("Error sending Sms: ", error);
    }
  };

  const getCurrentUser = async () => {
    const url = `${host}api/auth/me`;
    const accessToken = await getAuth();
    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(async (response) => {
          return await response.json();
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  };

  const registerUser = async (formData) => {
    const url = `${host}api/auth/register`;

    try {
      if (!formData) throw new Error("Заполнены не все поля");

      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${formData.token}`,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    } catch (error) {}
  };

  const checkPhone = (phoneNumber, isResetPassword = false) => {
    const url = `${host}api/sms/check-phone`;

    try {
      if (!phoneNumber) throw new Error("Номер телефона обязателен");

      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, isResetPassword }),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Ошибка при проверке номера: ", error);
          throw error;
        });
    } catch (error) {
      throw error;
    }
  };

  const getUserTeams = async () => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/my-teams`;

    return fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error("Error fetching all posts: ", error);
      });
  };

  const getTeamById = async (teamId) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/${teamId}`;

    return fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error("Error fetching all posts: ", error);
      });
  };

  const createTeam = async (formData) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/`;

    const requestBody = {
      team_name: formData.team_name,
      description: formData.description || "", // Добавляем описание, даже если пустое
    };

    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Важно указать content-type
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw err;
          });
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error creating team: ", error);
        throw error; // Пробрасываем ошибку дальше
      });
  };

  const editTeam = async (formData) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams`;

    const requestBody = {
      team_id: formData.team_id,
      team_name: formData.team_name || undefined,
      description: formData.description || "",
    };

    return fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Ошибка при редактировании команды:", error);
        throw error;
      });
  };

  const getTeamRequest = async (teamId) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/${teamId}/requests`;

    return fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error("Error fetching all posts: ", error);
      });
  };

  const getActiveInvitationToTeam = async (teamId) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/invitations/${teamId}`;

    return fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error("Error fetching all posts: ", error);
      });
  };

  const isValidInvitation = async (token) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/${token}/validate`;

    return fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error("Error fetching all posts: ", error);
      });
  };

  const createInvitationToTeam = async (invitationData) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/invitations`;
    const requestBody = {
      teamId: invitationData.team_id,
      maxUses: invitationData.maxUses ?? 1,
    };

    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Важно указать content-type
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          throw err;
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error creating team: ", error);
        throw error; // Пробрасываем ошибку дальше
      });
  };

  const acceptInvitationToTeam = async (invitationToken) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/acceptInvitation`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: invitationToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "Не удалось принять приглашение.",
        };
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message || "Приглашение успешно принято!",
      };
    } catch (error) {
      console.error("Error accepting invitation: ", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при принятии приглашения.",
      };
    }
  };

  const acceptTeamRequest = async (requestId) => {
    const url = `${host}api/teams/requests/${requestId}/accept`;
    const accessToken = await getAuth();

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Ошибка при принятии заявки:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const rejectTeamRequest = async (requestId) => {
    const url = `${host}api/teams/requests/${requestId}/reject`;
    const accessToken = await getAuth();

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Ошибка при отклонении заявки:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const sendLeaveTeamRequest = async (teamId) => {
    const accessToken = await getAuth(); // получаем токен пользователя
    const url = `${host}api/teams/leave`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team_id: teamId }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            result.message || "Не удалось отправить заявку на выход из команды",
        };
      }

      return {
        success: result.success,
        message:
          result.message || "Заявка на выход из команды успешно отправлена",
        request: result.result,
      };
    } catch (error) {
      console.error("Ошибка при выходе из команды:", error);
      return {
        success: false,
        message:
          error.message || "Произошла ошибка при попытке выхода из команды",
      };
    }
  };

  const removeTeamMember = async (teamId, userId, usertype) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/member`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, userId, usertype }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Не удалось удалить участника",
        };
      }

      return {
        success: result.success,
        message: result.message || "Участник успешно удалён",
      };
    } catch (error) {
      console.error("Ошибка при удалении участника из команды:", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при удалении участника",
      };
    }
  };

  const getUserChats = async () => {
    const accessToken = await getAuth();
    const url = `${host}api/chats`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "Не удалось получить чаты пользователя.",
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result, // Данные чатов пользователя
        message: "Чаты успешно получены!",
      };
    } catch (error) {
      console.error("Error fetching user chats: ", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при получении чатов.",
      };
    }
  };

  const getChatMessages = async (chatId) => {
    const accessToken = await getAuth(); // получение accessToken
    const url = `${host}api/chats/${chatId}/messages`; // предполагаемый маршрут

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "Не удалось получить сообщения чата.",
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result, // массив сообщений
        message: "Сообщения успешно получены!",
      };
    } catch (error) {
      console.error("Error fetching chat messages: ", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при получении сообщений.",
      };
    }
  };

  const searchMessages = async (query) => {
    const accessToken = await getAuth();

    const params = new URLSearchParams({
      q: query.toString(),
    });

    const url = `${host}api/chats/search/messages?${params}`;

    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Ошибка при поиске:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const togglePinedChat = async (chatId) => {
    const accessToken = await getAuth();

    const url = `${host}api/chats/pined/${Number(chatId)}`;

    console.log(url);

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Ошибка при закрепление чата:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const setStatusMessage = async (messageId) => {
    const accessToken = await getAuth();

    const url = `${host}api/chats/messages/${Number(messageId)}/status/1`;

    console.log(url);

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(async (response) => await response.json())
        .catch((error) => {
          console.error("Ошибка при обновление статуса сообщения:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const createChat = async (postId) => {
    const accessToken = await getAuth();

    const url = `${host}api/chats/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          post_id: postId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при создании чата");
      }

      const data = await response.json();

      return {
        chat: data.chat,
        post: data.post,
        current_user: data.current_user,
        opponent_user: data.opponent_user,
      };
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
      throw error;
    }
  };

  const getDocument = async (docType) => {
    let url = `${host}api/documents`;

    if (docType) {
      const params = new URLSearchParams({
        type: docType.toString(),
      });
      url += `?${params}`;
    }

    const response = await fetch(url);
    const resultJson = await response.json();
    if (!response.ok) {
      throw new Error(resultJson.message);
    }
    return resultJson;
  };

  const deleteChat = async (chatId) => {
    const accessToken = await getAuth();

    const url = `${host}api/chats/delete/${Number(chatId)}`;

    console.log(url);

    try {
      return fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(async (response) => await response.json())
        .catch((error) => {
          console.error("Ошибка при удаление чата:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const resetPassword = async (formData, token = "") => {
    const accessToken = token.length > 0 ? token : await getAuth();
    const url = `${host}api/auth/reset-password`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при сбросе пароля");
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при сбросе пароля:", error);
      throw error;
    }
  };

  const checkSmsCode = (token = "") => {
    const url = `${host}api/sms/check-code`;

    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Ошибка при проверке кода:", error);
          throw new Error("Ошибка при проверке кода:", error.message);
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getReferralLink = async () => {
    const accessToken = await getAuth();
    const url = `${host}api/referrals/link`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const result = await response.json();
      return {
        success: true,
        link: result.link,
        message: "Реферальная ссылка получена!",
      };
    } catch (error) {
      console.error("Error fetching referral link: ", error);
      throw error;
    }
  };

  const getUserReferrals = async () => {
    const accessToken = await getAuth();
    const url = `${host}api/referrals/invites`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching referrals: ", error);
      throw error;
    }
  };

  const createServiceRequest = async (formData) => {
    const accessToken = await getAuth();
    const url = `${host}api/requests`;

    console.log(formData);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.log("Произошла ошибка при создании заявки на услугу:", error);
      throw error;
    }
  };

  const getRequest = async (memberId) => {
    try {
      const accessToken = await getAuth();
      let url = `${host}api/requests`;

      if (memberId) {
        const params = new URLSearchParams({
          memberId: Number(memberId),
        });
        url += `?${params}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.log("Произошла ошибка при получении заявок:", error);
      throw error;
    }
  };

  const getStages = async () => {
    try {
      const accessToken = await getAuth();
      const url = `${host}api/requests/stages`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.log("Произошла ошибка при получении этапов заявки:", error);
      throw error;
    }
  };

  const changeStatusRequest = async (request_id, service_status) => {
    try {
      const accessToken = await getAuth();
      const url = `${host}api/requests/changeStatus`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request_id, service_status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.log(
        "Произошла ошибка во время обновления статуса заявки:",
        error
      );
      throw error;
    }
  };

  const changeAssignee = async (payload) => {
    try {
      const accessToken = await getAuth();
      const url = `${host}api/teams/changeAssignee`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.log("Произошла ошибка во время назначения исполнителя:", error);
      throw error;
    }
  };

  const registerPushToken = async (pushToken) => {
    const accessToken = await getAuth();
    const url = `${host}api/notifications/register-token`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ pushToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.log("Произошла ошибка при записи пуш токена:", error);
      throw error;
    }
  };

  const deletePushToken = async (pushToken) => {
    const accessToken = await getAuth();
    const url = `${host}api/notifications/remove-token`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pushToken: pushToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Не удалось пуш токен пользователя",
        };
      }

      return {
        success: result.success,
        message: result.message || "Пуш токен успешно удалён",
      };
    } catch (error) {
      console.error("Ошибка при удалении пуш токена:", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при пуш токена",
      };
    }
  };

  const restoreProfile = async (tempToken) => {
    const url = `${host}api/auth/restoreProfile`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tempToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Не удалось восстановить профиль",
        };
      }

      return {
        ...result,
        message: result.message || "Профиль успешно восстановлен",
      };
    } catch (error) {
      console.error("Ошибка при восстановлении профиля:", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при восстановлении профиля",
      };
    }
  };

  const getFavorites = async () => {
    const accessToken = await getAuth();
    const url = `${host}api/users/favorites`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Не удалось получить избранные посты",
        };
      }

      return result;
    } catch (error) {
      console.error("Ошибка при получении избрранных:", error);
      throw error;
    }
  };

  const addFavorites = async (postId) => {
    const accessToken = await getAuth();
    const url = `${host}api/users/favorites`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Не удалось добавить в избранное",
        };
      }

      return result;
    } catch (error) {
      console.error("Ошибка при добавление в избрранное:", error);
      throw error;
    }
  };

  const removeFavorites = async (postId) => {
    const accessToken = await getAuth();

    const url = `${host}api/users/favorites/${postId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Не удалось удалить из избранных",
        };
      }

      return result;
    } catch (error) {
      console.error("Ошибка при удалении из избрранных:", error);
      throw error;
    }
  };

  const confirmReferral = async (referralCode) => {
    const accessToken = await getAuth();
    const url = `${host}api/referrals/register`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referralCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            result.message || "Не удалось принять реферальное приглашение",
        };
      }

      return result;
    } catch (error) {
      console.error("Ошибка при принятии рефералки:", error);
      throw error;
    }
  };

  const createRequestChangeUserType = async () => {
    const accessToken = await getAuth();

    const url = `${host}api/users/change-type`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            result.message ||
            "Не удалось создать заявку на смену типа пользователя",
        };
      }

      return result;
    } catch (error) {
      console.error(
        "Ошибка при создании заявки на смену типа пользователя:",
        error
      );
      throw error;
    }
  };

  return (
    <ApiContext.Provider
      value={{
        getAllPosts,
        getPaginatedPosts,
        getAllVillages,
        getLogin,
        getUser,
        updateUser,
        getCompanyByName,
        getIsOwner,
        postRegister,
        sendSms,
        verifySms,
        changePhone,
        getPost,
        getVillage,
        getManyPosts,
        getUserPostsByStatus,
        getUserByID,
        sendPost,
        updatePost,
        updateStatus,
        updateUserStatus,
        getCurrentUser,
        registerUser,
        checkPhone,
        getUserTeams,
        getTeamById,
        createTeam,
        editTeam,
        getTeamRequest,
        getActiveInvitationToTeam,
        createInvitationToTeam,
        isValidInvitation,
        acceptInvitationToTeam,
        acceptTeamRequest,
        rejectTeamRequest,
        sendLeaveTeamRequest,
        removeTeamMember,
        getUserChats,
        getChatMessages,
        host,
        searchMessages,
        togglePinedChat,
        setStatusMessage,
        createChat,
        getDocument,
        deleteChat,
        resetPassword,
        checkSmsCode,
        getReferralLink,
        getUserReferrals,
        createServiceRequest,
        getRequest,
        getStages,
        changeStatusRequest,
        changeAssignee,
        registerPushToken,
        deletePushToken,
        restoreProfile,
        getFavorites,
        addFavorites,
        removeFavorites,
        confirmReferral,
        createRequestChangeUserType,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = () => useContext(ApiContext);
