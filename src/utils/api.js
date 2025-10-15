export const fetchSensorData = async () => {
    const response = await fetch("http://api.ehub.ph/rgb.php");
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
};
