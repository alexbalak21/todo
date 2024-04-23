function test_fn(n) {
    if (n > 10) {
        return {result: null, error: "To Large"}
    } else return {result: n > 5, error: null}
}

const {result, error} = test_fn(25)
if (error !== null) console.log(error)
else console.log(result)
