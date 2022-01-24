import axios from 'axios'

const fetchIPAddress = async () => {
    try {
        const {data} = await axios.get('https://pro.ip-api.com/json?fields=66842623&key=uGZgjL0qOTI19n4&lang=de')
        return data
    } catch (err) {
        console.err(err);
    }
}

export default fetchIPAddress
