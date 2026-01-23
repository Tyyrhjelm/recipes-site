# Testing Submission Form - Steps 1-3

## What's Been Built

Steps 1-3 of the 7-step recipe submission flow:
- **Step 1:** Identity & Pride (Athletes + Contributor)
- **Step 2:** Meaning Before Mechanics (Reflective questions)
- **Step 3:** Story (Optional narrative)

Plus full form state management and progress tracking.

## Quick Test (10 minutes)

### Prerequisites
1. Server running: `npm run dev`
2. Logged in via magic link
3. Browser at: http://localhost:3000

### Test Flow

#### 1. Start Submission
1. Click "Share Your Recipe" on landing page
2. Enter your email
3. Check PowerShell/VS Code terminal for magic link
4. Click the magic link
5. You should land on **Step 1**

#### 2. Test Step 1 (Identity & Pride)

**Single Athlete:**
- Enter athlete name: "Sarah Johnson"
- Enter sports: "Basketball, Swimming"
- Enter team (optional): "Greater Boston SO"
- Enter your name: "Maria Johnson"
- Select relationship: "Parent/Guardian"
- Click "Next"

**Multiple Athletes:**
- Click "+ Add Another Athlete"
- Fill in second athlete
- Try removing an athlete (X button)
- Note: Can't remove if only one left

**Validation:**
- Try clicking "Next" with empty fields
- Should see alert: "Please fill in at least one athlete..."

#### 3. Test Step 2 (Meaning Before Mechanics)

**Fill in fields:**
- What you love: "This is my grandmother's recipe. It always brings the family together."
- When you make it: "Sunday mornings and after big games"
- Click "Next"

**Test Skip:**
- Click "Back" to go to Step 1
- Click "Next" to return to Step 2
- Click "Skip this step"
- Should go directly to Step 3

**Test Back button:**
- From Step 2, click "Back"
- Should return to Step 1 with data intact

#### 4. Test Step 3 (Story)

**Write a story:**
```
This recipe has been in our family for three generations. 
My grandmother taught my mom, my mom taught me, and now 
I'm teaching Sarah. Every time we make it together, 
Sarah tells me about her latest swim meet or basketball game. 
It's become our special time together.
```
- Click "Next"
- Should reach Step 4 placeholder

**Test Skip:**
- Go back through Steps 2 and 1
- Navigate forward again
- At Step 3, click "Skip — I'll just share the recipe"
- Should skip directly to Step 4 placeholder

#### 5. Test Data Persistence

**Refresh Test:**
1. Fill out Steps 1-3 with data
2. At Step 3, refresh the page (F5)
3. Your data should still be there
4. Navigate back to Step 1
5. All your data should be preserved

**Browser Close Test:**
1. Fill out some data
2. Close browser tab completely
3. Open new tab, go to http://localhost:3000/submit/step-1
4. Your data should be restored from localStorage

**Multiple Sessions:**
1. Log out
2. Log in again with same email
3. Go to Step 1
4. Previous draft data should still be there (localStorage persists)

## Features to Test

### Progress Indicator
- [ ] Shows current step highlighted
- [ ] Shows completed steps with checkmarks
- [ ] Shows upcoming steps in gray
- [ ] Shows "Step X of 7" text
- [ ] Shows step labels (desktop)
- [ ] Shows current step label (mobile)

### Navigation
- [ ] "Next" button advances to next step
- [ ] "Back" button returns to previous step
- [ ] "Skip" button skips optional steps
- [ ] Data saves when navigating back
- [ ] Can navigate freely without losing data

### Form Validation
- [ ] Required fields show red asterisk (*)
- [ ] Can't proceed without required fields
- [ ] Alert message is helpful (not cryptic)
- [ ] Optional fields can be left blank

### Multi-Athlete Support
- [ ] Can add multiple athletes
- [ ] "+ Add Another Athlete" button works
- [ ] Can remove athletes (X button)
- [ ] Can't remove last athlete
- [ ] Each athlete has own name/sports/team fields
- [ ] Sports separated by commas parse correctly

### Mobile Responsiveness
- [ ] Form looks good on phone (narrow screen)
- [ ] Buttons are large enough to tap
- [ ] Text is readable without zooming
- [ ] Progress indicator adapts to mobile
- [ ] No horizontal scrolling

### Accessibility
- [ ] Can tab through form fields
- [ ] Labels are clear and descriptive
- [ ] Required fields marked clearly
- [ ] Helper text provides guidance
- [ ] Buttons have hover states

## Data Storage Test

Open browser DevTools → Application → Local Storage:

Look for key: `recipe_form_draft`

Value should be JSON like:
```json
{
  "formData": {
    "athletes": [
      {
        "name": "Sarah Johnson",
        "sports": ["Basketball", "Swimming"],
        "team_or_program": "Greater Boston SO"
      }
    ],
    "contributor_name": "Maria Johnson",
    "contributor_relationship": "Parent/Guardian",
    "what_you_love": "This is my grandmother's recipe...",
    "when_you_make_it": "Sunday mornings...",
    "story": "This recipe has been in our family..."
  },
  "currentStep": 3
}
```

## Common Issues

### "Cannot read properties of undefined"
**Problem:** Form context not initialized
**Solution:** Make sure you're starting from `/submit/step-1`, not jumping directly to step 2 or 3

### Data doesn't persist
**Problem:** LocalStorage not saving
**Solution:** 
- Check browser console for errors
- Make sure localStorage is enabled (not in incognito/private mode)
- Clear localStorage and start fresh: `localStorage.clear()`

### Can't navigate back
**Problem:** Missing history or context
**Solution:** Use the "Back" button in the form, not browser back button (browser back button works too but form button is better)

### Progress indicator wrong
**Problem:** Step number mismatch
**Solution:** The context tracks current step - if it's wrong, clear localStorage and start over

## Edge Cases to Test

### Empty optional fields
- Leave Step 2 fields blank
- Leave Step 3 story blank
- Should proceed without issues

### Very long text
- Enter 1000+ characters in story field
- Should save and display correctly
- No character limits implemented (intentional)

### Special characters
- Enter emojis: "We ❤️ this recipe!"
- Enter quotes: He said "this is great"
- Enter accented characters: José, María
- Should all work fine

### Multiple sports
- "Basketball, Swimming, Track & Field, Soccer"
- Should split into array correctly
- Extra spaces should be trimmed

### Unusual names
- Single name athletes
- Names with spaces: "Mary Jane"
- Names with hyphens: "Jean-Paul"
- Should all work

## What to Check

At the Step 4 placeholder, you should see:
- ✅ Confirmation that Steps 1-3 work
- List of working features
- List of what's coming next
- Button to go back to Step 1
- Log out button

## Next Steps

Once Steps 1-3 are tested and working:
1. ✅ Steps 1-3 are solid
2. → Build Step 4 (Recipe details)
3. → Build Step 5 (Photo upload)
4. → Build Step 6 (Consent)
5. → Build Step 7 (Confirmation & submission)

---

**Current Status:** Steps 1-3 complete and ready to test!
