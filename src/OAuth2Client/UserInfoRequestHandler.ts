import {AuthorizationServiceConfiguration, Requestor, AppAuthError, JQueryRequestor} from "@openid/appauth";
import {ResourceOwnerRequest} from "./ResourceOwnerRequest";

export class UserInfoRequestHandler {
    constructor(
        public readonly requester: Requestor = new JQueryRequestor()
    ) {
    }

    performUserInfoRequest(configuration: AuthorizationServiceConfiguration, request: ResourceOwnerRequest): Promise<any> {
        let userInfo = this.requester.xhr({
            url: configuration.userInfoEndpoint,
            method: 'GET',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + request.token,
            }
        });

        return userInfo.then((response: any) => {
            if (response.error) {
                Promise.reject(new AppAuthError(response.error, response));
                return;
            }

            return response;
        });
    }
}
