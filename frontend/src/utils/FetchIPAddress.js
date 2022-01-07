import axios from 'axios'

const fetchIPAddress = async () => {
    try {
        const {data} = await axios.get('http://ip-api.com/json/?lang=de')
        return data
    } catch (err) {
        console.err(err);
    }
}

export default fetchIPAddress
