package com.soen6011.careerservicebackend.request;

public class LoginRequest {
	String emailId;
	String password;

	public String getEmailId() {
		if (emailId != null && !emailId.isEmpty()) {
			return emailId.toLowerCase();
		}
		return null;
	}

	public String getPassword() {
		return password;
	}

}
