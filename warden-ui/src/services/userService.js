const API_BASE_URL = "http://localhost:8080/api/v1";

export const bulkInserUsersData = async (usersData) => {

    const entries = Object.entries(usersData);
    const N = entries.length;

    const repetitions = Math.ceil(N / 100);

    console.log("Repetitions: ", repetitions);

    for(let k = 0; k < repetitions; k++) {

        // we construct arr of objects with 100 objects in each repitition
        // we send 100 users objects at a time, then 100 again, and so on until we reach N
        const arrOfHundred = [];

        for(let i = k * 100; i < (k + 1) * 100 && i < N; i++) {

            const obj = entries[i][1];
            obj.userId = parseInt(entries[i][0].slice(1, ));  // removing U from front and converting to INT

            arrOfHundred.push(obj);
        }

        console.log(arrOfHundred);

        // sending this entire arrOfHundred arr to spring boot backend
        const response = await fetch(`${API_BASE_URL}/add-users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arrOfHundred)
        })
        
        if(!response.ok) {
            throw new Error("Reponse NOT ok");
        }

        const text = await response.text();  

        if(text) {
            console.log(JSON.parse(text));
        }
        else {
            console.log({status: "success"});
        }

        // return text ? JSON.parse(text) : {status: "success"};
    }


    return {status: "all chunks sent"}
}
