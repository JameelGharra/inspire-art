export const dynamic = 'force-dynamic';
const fetchImages = () => 
    fetch("/api/getimages", {
        cache: 'no-store'
    }).then(res => res.json())

export default fetchImages