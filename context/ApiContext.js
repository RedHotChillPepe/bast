import React, { createContext, useContext, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { getAuth } from '../utils/authUtils'

const ApiContext = createContext()
const host = process.env.EXPO_PUBLIC_API_HOST

export default function ApiProvider({ children }) {
  const getAllPosts = async () => {
    const accessToken = await getAuth();
    const url = `${host}api/posts`

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
    const accessToken = await getAuth();
    // Формируем строку запроса с параметрами
    if (!accessToken) return
    const query = new URLSearchParams({
      ...params, // Передаем все параметры
      page, // Добавляем параметр страницы
    }).toString();

    // Формируем URL с query параметрами
    const url = `${host}api/posts?${query}`;

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
    const accessToken = await getAuth();
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
    const accessToken = await getAuth();
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
    const accessToken = await getAuth();
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
    const accessToken = await getAuth();
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
    const accessToken = await getAuth();
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
    const accessToken = await getAuth();
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

    const accessToken = await getAuth();
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
    }
  };

  const getLogin = async (phone, password) => {
    const url = `${host}api/auth/login`;

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

    const accessToken = await getAuth();
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
    const accessToken = await getAuth();
    const updateData = JSON.stringify({
      id: userObject.id,
      usertype: userObject.usertype,
      phone: userObject.phoneNumber,
      name: userObject.name,
      surname: userObject.surname,
      email: userObject.email,
      photo: userObject.photo
    })

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
    const accessToken = await getAuth();
    const url = `${host}api/users/getuser?${query}`;

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
    const accessToken = await getAuth();
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

    const accessToken = await getAuth();
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
    const accessToken = await getAuth();
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
      throw error;
    }
  };

  const getUserTeams = async () => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/my-teams`

    return fetch(url, { headers: { "Authorization": `Bearer ${accessToken}` } })
      .then(response => response.json()
      )
      .then(json => { return json }
      )
      .catch(error => {
        console.error("Error fetching all posts: ", error);
      })
  }

  const getTeamById = async (teamId) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/${teamId}`

    return fetch(url, { headers: { "Authorization": `Bearer ${accessToken}` } })
      .then(response => response.json()
      )
      .then(json => { return json }
      )
      .catch(error => {
        console.error("Error fetching all posts: ", error);
      })
  }

  const createTeam = async (formData) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/`;

    const requestBody = {
      team_name: formData.team_name,
      description: formData.description || "" // Добавляем описание, даже если пустое
    };

    return fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json" // Важно указать content-type
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .catch(error => {
        console.error("Error creating team: ", error);
        throw error; // Пробрасываем ошибку дальше
      });
  }

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
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
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
    const url = `${host}api/teams/${teamId}/requests`

    return fetch(url, { headers: { "Authorization": `Bearer ${accessToken}` } })
      .then(response => response.json()
      )
      .then(json => { return json }
      )
      .catch(error => {
        console.error("Error fetching all posts: ", error);
      })
  }

  const getActiveInvitationToTeam = async (teamId) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/invitations/${teamId}`

    return fetch(url, { headers: { "Authorization": `Bearer ${accessToken}` } })
      .then(response => response.json()
      )
      .then(json => { return json }
      )
      .catch(error => {
        console.error("Error fetching all posts: ", error);
      })
  }

  const isValidInvitation = async (token) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/${token}/validate`

    return fetch(url, { headers: { "Authorization": `Bearer ${accessToken}` } })
      .then(response => response.json()
      )
      .then(json => { return json }
      )
      .catch(error => {
        console.error("Error fetching all posts: ", error);
      })
  }

  const createInvitationToTeam = async (invitationData) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/invitations`;
    const requestBody = {
      teamId: invitationData.team_id,
      maxUses: invitationData.maxUses ?? 1
    };

    return fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json" // Важно указать content-type
      },
      body: JSON.stringify(requestBody)
    })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json()
          throw err
        }
        return response.json();
      })
      .catch(error => {
        console.error("Error creating team: ", error);
        throw error; // Пробрасываем ошибку дальше
      });
  }

  const acceptInvitationToTeam = async (invitationToken) => {
    const accessToken = await getAuth();
    const url = `${host}api/teams/acceptInvitation`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: invitationToken })
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "Не удалось принять приглашение."
        };
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message || "Приглашение успешно принято!"
      };
    } catch (error) {
      console.error("Error accepting invitation: ", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при принятии приглашения."
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
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ team_id: teamId })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Не удалось отправить заявку на выход из команды"
        };
      }

      return {
        success: result.success,
        message: result.message || "Заявка на выход из команды успешно отправлена",
        request: result.result
      };
    } catch (error) {
      console.error("Ошибка при выходе из команды:", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при попытке выхода из команды"
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
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ teamId, userId, usertype })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Не удалось удалить участника"
        };
      }

      return {
        success: result.success,
        message: result.message || "Участник успешно удалён"
      };
    } catch (error) {
      console.error("Ошибка при удалении участника из команды:", error);
      return {
        success: false,
        message: error.message || "Произошла ошибка при удалении участника"
      };
    }
  };


  return (
    <ApiContext.Provider value={{
      getAllPosts, getPaginatedPosts, getAllVillages,
      getLogin, getUser, updateUser, getCompanyByName, getIsOwner, postRegister, sendSms, verifySms, changePhone,
      getPost, getVillage, getManyPosts, getUserPostsByStatus, getUserByID, sendPost, updatePost, updateStatus,
      updateUserStatus, getCurrentUser, registerUser, checkPhone, getUserTeams, getTeamById, createTeam, editTeam,
      getTeamRequest, getActiveInvitationToTeam, createInvitationToTeam, isValidInvitation, acceptInvitationToTeam,
      acceptTeamRequest, rejectTeamRequest, sendLeaveTeamRequest, removeTeamMember
    }}>
      {children}
    </ApiContext.Provider>
  )

}

export const useApi = () => useContext(ApiContext)
