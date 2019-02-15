 ((curl  http://localhost:8000/scoreCrossmatch/test1/test2 | select Content).Content | ConvertFrom-Json) |
%{
>> $name = $_.name
>> ForEach ($match in $_.matchedNames) {
>> New-Object psobject -Property @{
>> name = $name
>> match = $match.name
>> score = $match.score
>> }
>> }
>> } | ConvertTo-Csv -NoTypeInformation