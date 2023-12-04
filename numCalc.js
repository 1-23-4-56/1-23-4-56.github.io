function highNum(nums) {
    var ris = 0;

    ris = Math.max(...nums);
    ris = nums.indexOf(ris);

    return ris;
}