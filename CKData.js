// Written by Sam Hale, for a totally separate project

/**
 * Helper class that retrieves data from the CK Database
 */
class CKData {
    /**
     * Retrieves a single data set from the ckDatabase
     *
     * @param dataSet Name of data set to retrieve
     * @returns {Promise<Array>} Array of data points
     */
    static async fetchData(dataSet) { // TODO: address the content object in the return here?
        const url = `http://ckdata2.herokuapp.com/api/v1/dataset.json?group_name=${dataSet}`;
        let data = [];
        await fetch(url, {method: 'GET', mode: 'cors'})
            .then(response => response.json())
            .then((response) => {
                // JSON data is retrieved HERE, where response is an array of elements of the dataset
                data = response.map(item => item.content);
            })
            .catch((error) => {
                page.innerHTML = '<p> An error occurred when fetching the data.';
                console.error(error);
            });
        return data;
    }
}
