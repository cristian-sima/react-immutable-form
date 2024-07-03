/**
 * Custom error class for immutable form errors.
 */
class ImmutableFormError extends Error {
  /**
     * Constructs an ImmutableFormError with the specified error message.
     * @param message The error message.
     */
  constructor(message: string) {
    super(message);
    this.name = "ImmutableFormError";
    // Set the prototype explicitly to ensure correct prototype chain
    Object.setPrototypeOf(this, ImmutableFormError.prototype);
  }
}

/**
 * Example usage:
 * ```
 * try {
 *     // Example usage where data.Error is not ""
 *     let data = { Error: "An error occurred." };
 *     processData(data);
 * } catch (error) {
 *     if (error instanceof ImmutableFormError) {
 *         console.error("Caught an ImmutableFormError:", error.message);
 *     } else {
 *         console.error("Caught an error:", error.message);
 *     }
 * }
 * ```
 */

export default ImmutableFormError;
