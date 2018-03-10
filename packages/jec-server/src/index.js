import Jec from "jec-core";
import RAM from "random-access-memory";

const [ _, __, key, ] = process.argv;

const jec = new Jec(RAM, key);
jec.onUpdate( state => console.log(JSON.stringify(state, null, 2) ));
