import React, { createContext, useContext } from 'react'
import { Alert } from 'react-native'


const ApiContext = createContext()
const host = process.env.EXPO_PUBLIC_API_HOST

export default function ApiProvider({ children }) {

  const getAllPosts = async () => {
    const url = host + "api/posts/all"
    console.log(url);

    return fetch(url)
      .then(response => response.json()
      )
      .then(json => { return json.rows }
      )
      .catch(error => {
        console.error("Error fetching files: ", error);
      })
  }

  const getManyPosts = async (data) => {
    const url = host + `api/posts/manyPosts`;
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
    const query = new URLSearchParams(params) != "undefined" || params != undefined ? new URLSearchParams(params) : ""
    console.log("paginated query: ", typeof (query));

    const url = host + `api/posts/page/${page}?` + query.toString()
    console.log(url);

    return fetch(url)
      .then(response => response.json()
      )
      .then(json => { return [json.rows, json.rowCount] }
      )
      .catch(error => {
        console.error("Error fetching files: ", error);
        Alert.alert("Error", "Network Error")
      })
  }

  const getPost = async (id) => {
    const url = host + `api/posts/${id}`;

    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
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

  const getUserPostsByStatus = async (user_id, status_int) => {
    const url = `${host}api/posts/getUserPostsByStatus`;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          post_status: status_int,
        }),
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
    const url = host + "api/posts/newpost";

    // Функция для извлечения числового значения из объекта (если нужно)
    const getNumericValue = (field) => {
      if (field && typeof field === 'object') {
        return Number(field.value);
      }
      return field;
    };

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{
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
        }]),
      })
        .then((response) => response)
        .catch((error) => {
          console.error("Error executing query ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };


  const updatePost = async (data, id) => {
    const url = host + "api/posts/updatepost";

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
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
            id: id,
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

  const updateStatus = async (value) => {
    const url = host + "api/posts/updateStatus";

    const { post_id, post_status } = value;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post_id,
          post_status: post_status,
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
    const url = host + "api/villages/all";
    console.log(url);

    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        return json.rows;
      })
      .catch((error) => {
        console.error("Error fetching files: ", error);
      });
  };

  const postRegister = async (data) => {
    const url = host + "api/users/newuser";
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
    const url = host + "api/users/login";
    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            phone: phone,
            password: password,
          },
        ]),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error getting logged in: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async (phone, query) => {
    const url =
      host + "api/users/getuser" + (query != undefined ? "?user=" + query : "");

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            phone: phone,
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
    const url = host + `api/users/updateuserstatus`

    try {
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          usertype: usertype,
          newStatus: newStatus
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
    const url = host + `api/users/getcompany/${companyName}`;

    try {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
    const url = host + `api/users/updateuser`

    try {
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userObject.id,
          usertype: userObject.usertype,
          phoneNumber: userObject.phoneNumber,
          name: userObject.name,
          surname: userObject.surname,
          email: userObject.email,
          photo: userObject.photo
        })
      })
        .then(response => { return response })
        .catch(error => {
          console.error("Error updating user: ", error);
          Alert.alert("Error", "Network Error")
        })
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network Error")
    }
  }

  const getUserByID = async (id, usertype) => {
    const url = host + `api/users/getuser/${usertype || "user"}/${id}`

    try {
      return fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
        .then(response => { return response })
        .catch(error => {
          console.error("Error getting user: ", error);
        })
    } catch (error) {
      console.error(error);
    }

  };

  const getIsOwner = async (phone, password, postid) => {
    const url = host + "api/users/getisowner";
    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            phone: phone,
            password: password,
            post_id: Number(postid),
          },
        ]),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error getting user ownership: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const sendSms = async (phone) => {
    const url = host + "api/sms/sendsms";

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            phone: phone,
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
      console.error("Error sending Sms: ", error);
    }
  };

  const verifySms = async (phone, code) => {
    const url = host + "api/sms/verifysms";

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            phone: phone,
            code: code,
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
      console.error("Error sending Sms: ", error);
    }
  }

  const changePhone = async (phone, userId, usertype) => {
    const url = host + "api/sms/changephone"

    try {
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          phone: phone,
          userId: userId,
          usertype: usertype
        }])
      })
        .then(response => { return response })
        .catch(error => {
          console.error("Error: ", error);
        })
    } catch (error) {
      console.error("Error sending Sms: ", error);
    }

  }

  return (
    <ApiContext.Provider value={{
      getAllPosts, getPaginatedPosts, getAllVillages,
      getLogin, getUser, updateUser, getCompanyByName, getIsOwner, postRegister, sendSms, verifySms, changePhone,
      getPost, getManyPosts, getUserPostsByStatus, getUserByID, sendPost, updatePost, updateStatus, updateUserStatus
    }}>
      {children}
    </ApiContext.Provider>
  )

}


export const useApi = () => useContext(ApiContext)
