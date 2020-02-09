xports.getDate=function()
{
  var CurrentDay= new Date();
  var options={
    weekday:"long",
    month:"long",
    day:"2-digit",
    year:"numeric"
  };
    return CurrentDay.toLocaleString("en-US", options);
}
