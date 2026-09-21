using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

internal static class PaperclipDeSetup
{
    // Der Build ersetzt diesen Platzhalter durch install-de.ps1 als Base64-Text.
    private const string InstallScriptBase64 = "__SCRIPT_BASE64__";

    [STAThread]
    public static void Main(string[] args)
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new InstallerWindow(args));
    }

    private sealed class InstallerWindow : Form
    {
        private readonly string[] installArguments;
        private readonly Label statusLabel;
        private readonly ProgressBar progress;
        private readonly RichTextBox log;
        private readonly Button startButton;
        private int exitCode = 1;

        public InstallerWindow(string[] args)
        {
            installArguments = args;
            Text = "Paperclip DE installieren";
            ClientSize = new Size(760, 530);
            MinimumSize = new Size(660, 480);
            StartPosition = FormStartPosition.CenterScreen;
            BackColor = Color.FromArgb(24, 24, 27);
            ForeColor = Color.FromArgb(244, 244, 245);
            Font = new Font("Segoe UI", 10F, FontStyle.Regular, GraphicsUnit.Point);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;

            var header = new Label
            {
                AutoSize = true,
                Location = new Point(28, 24),
                Text = "Paperclip DE",
                Font = new Font("Segoe UI", 20F, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.White,
            };
            Controls.Add(header);

            var subtitle = new Label
            {
                AutoSize = true,
                Location = new Point(30, 62),
                Text = "Die deutsche Paperclip-Version wird eingerichtet.",
                ForeColor = Color.FromArgb(212, 212, 216),
            };
            Controls.Add(subtitle);

            statusLabel = new Label
            {
                AutoSize = false,
                Location = new Point(30, 104),
                Size = new Size(700, 26),
                Text = "Installation wird vorbereitet ...",
                Font = new Font("Segoe UI", 10F, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(147, 197, 253),
            };
            Controls.Add(statusLabel);

            progress = new ProgressBar
            {
                Location = new Point(30, 136),
                Size = new Size(700, 8),
                Style = ProgressBarStyle.Marquee,
                MarqueeAnimationSpeed = 28,
            };
            Controls.Add(progress);

            log = new RichTextBox
            {
                Location = new Point(30, 168),
                Size = new Size(700, 286),
                ReadOnly = true,
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.FromArgb(39, 39, 42),
                ForeColor = Color.FromArgb(228, 228, 231),
                Font = new Font("Cascadia Mono", 9F, FontStyle.Regular, GraphicsUnit.Point),
                DetectUrls = true,
                ScrollBars = RichTextBoxScrollBars.Vertical,
                WordWrap = true,
            };
            Controls.Add(log);

            var closeButton = new Button
            {
                Text = "Schliessen",
                DialogResult = DialogResult.Cancel,
                Location = new Point(630, 475),
                Size = new Size(100, 34),
                FlatStyle = FlatStyle.Flat,
                BackColor = Color.FromArgb(63, 63, 70),
                ForeColor = Color.White,
            };
            closeButton.FlatAppearance.BorderColor = Color.FromArgb(82, 82, 91);
            Controls.Add(closeButton);
            CancelButton = closeButton;

            startButton = new Button
            {
                Text = "Paperclip DE starten",
                Location = new Point(442, 475),
                Size = new Size(174, 34),
                Enabled = false,
                FlatStyle = FlatStyle.Flat,
                BackColor = Color.FromArgb(37, 99, 235),
                ForeColor = Color.White,
            };
            startButton.FlatAppearance.BorderColor = Color.FromArgb(96, 165, 250);
            startButton.Click += (sender, eventArgs) => StartPaperclip();
            Controls.Add(startButton);

            Shown += async (sender, eventArgs) => await RunInstallationAsync();
        }

        private async Task RunInstallationAsync()
        {
            WriteLine("Willkommen. Dieses Fenster zeigt jeden Installationsschritt an.");
            WriteLine("Abhängig von Ihrer Internetverbindung kann die Einrichtung einige Minuten dauern.");
            WriteLine("");
            exitCode = await Task.Run(() => RunInstaller());
            progress.Style = ProgressBarStyle.Continuous;
            progress.Value = 100;

            if (exitCode == 0)
            {
                statusLabel.Text = "Installation erfolgreich abgeschlossen";
                statusLabel.ForeColor = Color.FromArgb(134, 239, 172);
                WriteLine("");
                WriteLine("Fertig. Paperclip DE liegt unter %LOCALAPPDATA%\\Paperclip-DE.");
                WriteLine("Sie können es jetzt starten oder später über die Desktop-Verknüpfung öffnen.");
                startButton.Enabled = true;
                startButton.Focus();
            }
            else
            {
                statusLabel.Text = "Installation konnte nicht abgeschlossen werden";
                statusLabel.ForeColor = Color.FromArgb(252, 165, 165);
                WriteLine("");
                WriteLine("Bitte prüfen Sie die Meldungen oben und starten Sie die EXE danach erneut.");
            }
        }

        private int RunInstaller()
        {
            string scriptPath = Path.Combine(Path.GetTempPath(), "paperclip-de-install-" + Guid.NewGuid().ToString("N") + ".ps1");
            try
            {
                File.WriteAllText(
                    scriptPath,
                    Encoding.UTF8.GetString(Convert.FromBase64String(InstallScriptBase64)),
                    // Windows PowerShell 5.1 erkennt UTF-8 ohne BOM sonst als ANSI.
                    new UTF8Encoding(true));

                string powershell = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.Windows),
                    "System32\\WindowsPowerShell\\v1.0\\powershell.exe");
                string arguments = "-NoLogo -NoProfile -ExecutionPolicy Bypass -File " + Quote(scriptPath);
                foreach (string argument in installArguments)
                    arguments += " " + Quote(argument);

                var startInfo = new ProcessStartInfo
                {
                    FileName = powershell,
                    Arguments = arguments,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    StandardOutputEncoding = new UTF8Encoding(false),
                    StandardErrorEncoding = new UTF8Encoding(false),
                    WorkingDirectory = Environment.CurrentDirectory,
                };
                using (Process process = new Process { StartInfo = startInfo })
                {
                    process.OutputDataReceived += (sender, eventArgs) =>
                    {
                        if (!String.IsNullOrWhiteSpace(eventArgs.Data)) WriteLine(eventArgs.Data);
                    };
                    process.ErrorDataReceived += (sender, eventArgs) =>
                    {
                        if (!String.IsNullOrWhiteSpace(eventArgs.Data)) WriteLine("Fehler: " + eventArgs.Data);
                    };
                    if (!process.Start()) throw new InvalidOperationException("Die Installationsroutine konnte nicht gestartet werden.");
                    process.BeginOutputReadLine();
                    process.BeginErrorReadLine();
                    process.WaitForExit();
                    return process.ExitCode;
                }
            }
            catch (Exception error)
            {
                WriteLine("Fehler: Die Installationsroutine konnte nicht gestartet werden.");
                WriteLine(error.Message);
                return 1;
            }
            finally
            {
                try { if (File.Exists(scriptPath)) File.Delete(scriptPath); } catch { }
            }
        }

        private void StartPaperclip()
        {
            try
            {
                string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcut = Path.Combine(desktop, "Paperclip DE.lnk");
                if (!File.Exists(shortcut)) throw new FileNotFoundException("Die Desktop-Verknüpfung wurde nicht gefunden.", shortcut);
                Process.Start(new ProcessStartInfo { FileName = shortcut, UseShellExecute = true });
                Close();
            }
            catch (Exception error)
            {
                statusLabel.Text = "Paperclip DE konnte nicht gestartet werden";
                statusLabel.ForeColor = Color.FromArgb(252, 165, 165);
                WriteLine("Fehler: " + error.Message);
            }
        }

        private void WriteLine(string value)
        {
            if (InvokeRequired)
            {
                BeginInvoke(new Action<string>(WriteLine), value);
                return;
            }
            log.AppendText(value + Environment.NewLine);
            log.SelectionStart = log.TextLength;
            log.ScrollToCaret();
        }

        private static string Quote(string value)
        {
            return "\"" + value.Replace("\"", "\\\"") + "\"";
        }
    }
}
