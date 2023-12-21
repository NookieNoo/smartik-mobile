import API from './config';

/*export class Reference {
	static async minimum () {
		let result = await API.requestApi("get", "/v1/reference/minimum", {noAuth: true})
		return result
	}
}

export class User {
	static async info () {
		let result = await API.requestApi("get", "/v1/user/info")
		return result
	}

	static async login (data) {
		let result = await API.requestApi("post", "/v1/user/login", {data: data})
		return result
	}
}*/

/*static async editSetting (data) {
	let result = await API.requestApi("post", "/v1/user/settings", {data: data})
	return result
}

static async avatarUpload (data) {
	const formData = new FormData()
	formData.append("image", data)

	let result = await API.requestApi("post", "/v1/user/avatar", {
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
	return result
}

static async avatarRemove () {
	let result = await API.requestApi("delete", "/v1/user/avatar")
	return result
}

static async pushToken (data) {
	let result = await API.requestApi("post", "/v1/user/push_token", {data})
	return result
}*/
