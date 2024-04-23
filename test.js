const row = {id: 1, name: "update name 11", description: "update description 11"}

const a = {b: {c: "Hi!"}}
const {
    b: formerB,
    b: {c},
} = a

const {id: cid, name: cname, description: cdesc} = row

console.log(cid)
