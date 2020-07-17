module.exports = function ParseData(data) {
    // console.log(data);
    let parsed_data = [];

    let alpha = 1;

    let colorPal = ["rgba(223, 79, 79," + alpha + ")",
        "rgba(88, 223, 79," + alpha + ")",
        "rgba(79, 145, 223," + alpha + ")",
        "rgba(223, 79, 168," + alpha + ")",
        "rgba(223, 155, 79," + alpha + ")",
        "rgba(79, 223, 192," + alpha + ")",
        "rgba(138, 79, 223," + alpha + ")",
        "rgba(166, 223, 79," + alpha + ")",
        "rgba(147, 50, 55," + alpha + ")",
        "rgba(50, 147, 142," + alpha + ")",
        "rgba(59, 147, 50," + alpha + ")",
        "rgba(94, 50, 147," + alpha + ")",
        "rgba(147, 78, 50," + alpha + ")",
        "rgba(50, 81, 147," + alpha + ")"];


    // extract raw data by org
    for (i in data) {
        org = data[i].target;
        parsed_data[i] = { "org": org, "data": [] };
        let inner_buckets = data[i].datapoints;
        for (j in inner_buckets) {
            date = inner_buckets[j][1];
            value = inner_buckets[j][0];
            parsed_data[i].data[j] = { "date": date, "value": value, "rank": 0, "orig_index": parseInt(i) }
        }
    }

      // assign ranks to data
    for (i in parsed_data[0].data) {
        let temp_array = []
        for (j in parsed_data) {
            temp_array[j] = parsed_data[j].data[i]
        }
        temp_array.sort((a, b) => { return b.value - a.value })
        for (let k = 0; k < temp_array.length; k++) {
            parsed_data[temp_array[k].orig_index].data[i].rank = k
        }
    }

    // add color and org to data points

    for (i in parsed_data) {
        for (j in parsed_data[i].data) {
            parsed_data[i].data[j].org = parsed_data[i].org
            parsed_data[i].data[j].color = colorPal[i % colorPal.length]
        }
    }

    // Starting pos = parsed_data[i].org
    // Find final positions
    let final_positions = [];
    for (i in parsed_data) {
        let last = parsed_data[i].data[parsed_data[i].data.length - 1];
        final_positions[i] = {
            org: last.org,
            rank: last.rank
        }
    }
    final_positions.sort((a, b) => { return a.rank - b.rank })

    // list of dates for x axis
    let dates = [];
    for (i in parsed_data[0].data) {
        dates[i] = parsed_data[0].data[i].date;
    }

    let returnObj = {
        parsed_data: parsed_data,
        final_positions: final_positions,
        colorPal: colorPal,
        dates: dates
    }

    // console.log("stuff returned")
    console.log(returnObj);

    return returnObj;

}