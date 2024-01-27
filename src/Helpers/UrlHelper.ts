export class UrlHelper {
    public static getUrl(url: string): string {
        let result = new URL(url);
        return result.origin + result.pathname;
    }

    public static getParameters(url: string): { [key: string]: string } {
        let currentUrl = new URL(url);
        let searchParams = new URLSearchParams(currentUrl.search);

        let paramsJson: { [key: string]: string } = {};

        searchParams.forEach((value, key) => {
            paramsJson[key] = value;
        });

        if (currentUrl.hash) {
            let fragment = currentUrl.hash.substring(1);

            const secondHashIndex = fragment.indexOf('#');
            if (secondHashIndex !== -1) {
                fragment = fragment.substring(0, secondHashIndex);
            }

            const firstQuestionMarkIndex = fragment.indexOf('?');
            if (firstQuestionMarkIndex !== -1) {
                fragment = fragment.substring(firstQuestionMarkIndex);
            }

            const hashParams = new URLSearchParams(fragment);
            hashParams.forEach((value, key) => {
                paramsJson[key] = value;
            });
        }

        return paramsJson;
    }
}
