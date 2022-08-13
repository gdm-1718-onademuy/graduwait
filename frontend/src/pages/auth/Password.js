
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  error={passwordValidator(password) === false ||  password === ""}
                  //helperText={passwordValidator(password) ? '' : 'Please make sure there are at least 8 characters, including a capital letter, a digit and a special sign.'}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Grid>