function msANDms(ms1:number | Date, ms2:number | Date){
    if(typeof ms1 !== 'number') ms1 = ms1.getTime();
    if(typeof ms2 !== 'number') ms2 = ms2.getTime();

    if(ms2 > ms1){
        return ms2 - ms1;
    }

    return ms1 - ms2;
}

export default msANDms;