import { useState, useEffect, useRef, type FormEvent } from "react";

type FormState = "idle" | "loading" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const SERVICE_OPTIONS = [
  { value: "", label: "ご興味のあるサービス" },
  { value: "system-development", label: "システム開発" },
  { value: "web-development", label: "HP開発・運用" },
  { value: "business-planning", label: "経営企画" },
  { value: "video-editing", label: "動画編集" },
  { value: "other", label: "その他" },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export default function ContactSection() {
  const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY as string;
  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string;

  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string>("");

  useEffect(() => {
    if (!siteKey) return;

    const renderTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !turnstileWidgetId.current) {
        turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          theme: "dark",
          size: "normal",
        });
      }
    };

    if (window.turnstile) {
      renderTurnstile();
      return;
    }

    window.onTurnstileLoad = renderTurnstile;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = "";
      }
    };
  }, [siteKey]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    const name = nameRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const message = messageRef.current?.value.trim() ?? "";

    if (!name) errs.name = "お名前を入力してください";
    if (!email) {
      errs.email = "メールアドレスを入力してください";
    } else if (!EMAIL_REGEX.test(email)) {
      errs.email = "正しいメールアドレスを入力してください";
    }
    if (!message) errs.message = "メッセージを入力してください";

    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormState("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormState("success");
        form.reset();
        if (turnstileWidgetId.current && window.turnstile) {
          window.turnstile.reset(turnstileWidgetId.current);
        }
      } else {
        setFormState("error");
        setErrorMessage(data.message ?? "送信に失敗しました。もう一度お試しください。");
      }
    } catch {
      setFormState("error");
      setErrorMessage("ネットワークエラーが発生しました。しばらくしてからもう一度お試しください。");
    }
  };

  const handleRetry = () => {
    setFormState("idle");
    setErrorMessage("");
    setErrors({});
  };

  const inputClass =
    "w-full rounded-[10px] text-sm outline-none font-[inherit] transition-[border-color] duration-300 " +
    "bg-white/[0.08] border border-white/[0.15] text-[#f0f0f5] placeholder:text-white/30";

  return (
    <section
      id="contact"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px clamp(24px, 6vw, 80px) 100px" }}
    >
      {/* Section Title */}
      <div style={{ marginBottom: 40 }}>
        <span
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#8b5cf6",
            marginBottom: 8,
            fontFamily: "var(--font-heading)",
          }}
        >
          Contact
        </span>
        <h2
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 300,
            color: "#ffffff",
            fontFamily: "var(--font-heading)",
            letterSpacing: "0.04em",
            marginBottom: 16,
          }}
        >
          お問い合わせ
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 2 }}>
          ご相談・お見積りは無料です。2営業日以内にご返信いたします。
        </p>
      </div>

      {/* Success State */}
      {formState === "success" && (
        <div
          role="status"
          className="glass"
          style={{
            padding: "48px 32px",
            textAlign: "center",
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: "0 auto 16px" }}
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3
            style={{
              fontSize: 18,
              color: "#ffffff",
              fontWeight: 300,
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.08em",
              margin: "0 0 8px",
            }}
          >
            送信しました
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            お問い合わせありがとうございます。
          </p>
        </div>
      )}

      {/* Form State (idle or loading or error) */}
      {formState !== "success" && (
        <div
          className="glass"
          style={{
            padding: "36px 32px",
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          {/* Error State Banner */}
          {formState === "error" && (
            <div
              role="alert"
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 24,
                fontSize: 13,
                color: "#fca5a5",
              }}
            >
              {errorMessage}
            </div>
          )}

          <form aria-label="お問い合わせフォーム" onSubmit={handleSubmit} noValidate>
            {/* Hidden Web3Forms fields */}
            <input type="hidden" name="access_key" value={accessKey} />
            <input type="checkbox" name="botcheck" className="hidden" aria-hidden="true" tabIndex={-1} />

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Name + Email — 2col on desktop, 1col on mobile */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                }}
              >
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="sr-only">
                    お名前
                  </label>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 6,
                      letterSpacing: "0.05em",
                    }}
                  >
                    お名前 *
                  </span>
                  <input
                    id="contact-name"
                    ref={nameRef}
                    type="text"
                    name="name"
                    placeholder="山田 太郎"
                    required
                    aria-required="true"
                    aria-describedby={errors.name ? "error-name" : undefined}
                    aria-invalid={!!errors.name}
                    className={inputClass}
                    disabled={formState === "loading"}
                  />
                  {errors.name && (
                    <p
                      id="error-name"
                      role="alert"
                      style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="sr-only">
                    メールアドレス
                  </label>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 6,
                      letterSpacing: "0.05em",
                    }}
                  >
                    メールアドレス *
                  </span>
                  <input
                    id="contact-email"
                    ref={emailRef}
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    required
                    aria-required="true"
                    aria-describedby={errors.email ? "error-email" : undefined}
                    aria-invalid={!!errors.email}
                    className={inputClass}
                    disabled={formState === "loading"}
                  />
                  {errors.email && (
                    <p
                      id="error-email"
                      role="alert"
                      style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Service Select */}
              <div>
                <label htmlFor="contact-service" className="sr-only">
                  ご興味のあるサービス
                </label>
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 6,
                    letterSpacing: "0.05em",
                  }}
                >
                  ご興味のあるサービス
                </span>
                <select
                  id="contact-service"
                  ref={serviceRef}
                  name="service"
                  className={inputClass}
                  style={{ appearance: "none" }}
                  disabled={formState === "loading"}
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="sr-only">
                  メッセージ
                </label>
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 6,
                    letterSpacing: "0.05em",
                  }}
                >
                  メッセージ *
                </span>
                <textarea
                  id="contact-message"
                  ref={messageRef}
                  name="message"
                  rows={5}
                  placeholder="ご相談内容をお書きください"
                  required
                  aria-required="true"
                  aria-describedby={errors.message ? "error-message" : undefined}
                  aria-invalid={!!errors.message}
                  className={inputClass}
                  style={{ resize: "vertical" }}
                  disabled={formState === "loading"}
                />
                {errors.message && (
                  <p
                    id="error-message"
                    role="alert"
                    style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Cloudflare Turnstile */}
              {siteKey && (
                <div ref={turnstileRef} className="cf-turnstile" data-sitekey={siteKey} />
              )}

              {/* Submit / Retry Button */}
              {formState === "error" ? (
                <button
                  type="button"
                  onClick={handleRetry}
                  style={{
                    background: "transparent",
                    color: "#f0f0f5",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 12,
                    padding: "12px 32px",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    fontFamily: "var(--font-heading)",
                    transition: "all 0.3s ease",
                    marginTop: 4,
                    alignSelf: "flex-start",
                  }}
                >
                  再送信
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  style={{
                    background: formState === "loading" ? "rgba(139,92,246,0.5)" : "#8b5cf6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "16px 32px",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    cursor: formState === "loading" ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-heading)",
                    transition: "all 0.3s ease",
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (formState !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.background = "#7c3aed";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formState !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.background = "#8b5cf6";
                    }
                  }}
                >
                  {formState === "loading" ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ animation: "spin 1s linear infinite" }}
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      送信中...
                    </>
                  ) : (
                    <>
                      送信する
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Unified padding for all form fields: px=24px, py=14px (Stripe/Linear style) */
        /* All padding managed here to avoid Tailwind specificity conflicts */
        #contact input[type="text"],
        #contact input[type="email"] {
          padding: 14px 24px;
          min-height: 48px;
          box-sizing: border-box;
        }
        #contact select {
          padding: 14px 24px;
          height: 48px;
          box-sizing: border-box;
        }
        #contact textarea {
          padding: 14px 24px;
          box-sizing: border-box;
        }
        #contact input:focus,
        #contact select:focus,
        #contact textarea:focus {
          border-color: #8b5cf6;
          background: rgba(255,255,255,0.10);
        }
        #contact input:disabled,
        #contact select:disabled,
        #contact textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        /* Fix: select option white-on-white bug */
        #contact select option {
          background-color: #1a0f24;
          color: #f0f0f5;
        }
        /* Hide Turnstile badge (officially permitted) */
        #contact .cf-turnstile {
          position: absolute;
          visibility: hidden;
          width: 0;
          height: 0;
          overflow: hidden;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
