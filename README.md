# Calculator

Resurrection of the calculator app that was pulled from gaia.

It's been cloned and the app in the brokenCalc folder has had defects inserted into the code as a tool for test engineer interviews. The candidate should be given a machine with the calculator and broken calculator open in separate browser tabs. Give them 20 minutes to document as many bugs as they can find (quick description without steps to reproduce)

Anyone who adds bugs to the test should document them here.

## Test Suite

[Test Suite](http://mozilla.github.io/calculator/test/)

# Answer Key


Divide by 0 returns ‘1’

Changed displayable digits from 9 to 7

Number format switches to exponent at 10 million instead of a billion

2 different shades of orange

You can input just a bunch of 0s now

You can put in multiple decimal points (it ignores anything after the 2nd decimal)

Extra left padding on the ‘0’ button

Font changed from 10pt to 12pt

Number display alignment is slightly different 

The ‘8’ is a ‘9’ now

0 divided by negative number used to show 'error'. Now It’s NaN

A number smaller than -1000 returns ‘Y so negative?’

Cursor switches to pointer for +,=,-,*,/,and 0

When making a negative number, the ‘-‘ doesn’t immediately show up

There’s a delay returning numbers > 9999

No more leading 0 upon initial click of "."

Pressing clear updates display with nothing when it should have "0"

There are trailing 0's after certain computations

Clearing does not reset chosen operation when it should

Consecutive operations do not work if you press equal 
-//start().press(6).press('*').press(2).press('='); 
-//should.equal('12');
-//press.(+).press(8).press('=');
-//should.equal('20'); however, does not equal 20 unless "+" is hit instead of "="

Multiple consecutive clicks of the "clear" button does something 
-Kyle is helping me implement this.