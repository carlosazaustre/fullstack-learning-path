import axios from "axios";
import loginService from "./loginService";

jest.mock("axios");

describe("loginService", () => {
  test("should call axios.post", async () => {
    const credentials = {
      username: "test",
      password: "test",
    };

    await axios.post.mockImplementation(() => Promise.resolve({}));
    await loginService.login(credentials);

    await expect(axios.post).toHaveBeenCalledWith("/api/login", credentials);
  });
});
