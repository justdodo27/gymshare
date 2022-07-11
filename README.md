# Gymshare

description

## Functionality
- [ ] U Create account
- [ ] UA Login to account
- [ ] UA Create workouts from exercises
- [ ] UA Run any workout from mobile app
- [ ] UA View profile with stats etc.
- [ ] UA Search/Filter other accounts
- [ ] UA Add to favorites
- [ ] A Create exercise
- [ ] A Edit/Delete any public workouts

### Additional functionality
- [ ] Chat room
- [ ] Instagram like workouts share (main page works similar to instagram)
- [ ] Friends list
- [ ] Rating public workouts

### Exercises
- Title
- Description
- Difficulty tag
- Avg. calories burn rate
- Thumbnail
- Video/Gif
- Type (time, repeats)

### Exercise_workout
- FK Workout
- FK Exercise
- Order number
- Repeats
- Time
- Series count

### Workouts
- Title
- Description
- Sum of calories burn rate
- Difficulty (calculated from exercieses tags)
- Visibility (public, private)
- Foreign key to exercises
- Avg. time to complete
- Workout cycles