import { Nexios } from "nexios-http";

const nexiosInstance = new Nexios({
	baseURL: "https://e-commerce-web-application-rust.vercel.app/",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	}
})

export default nexiosInstance