const simulate = document.querySelector('#simulate');
const reset = document.querySelector('#reset');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
const placeholder = document.querySelector('#placeholder');
const stepTwo = document.querySelector('#step-2');
const stepThree = document.querySelector('#step-3');

simulate.addEventListener('click', async () => {
  simulate.disabled = true;
  status.classList.remove('error');
  status.textContent = 'Executando o cenário fictício nesta máquina…';
  stepTwo.classList.add('active');
  try {
    // O único dado enviado é o nome de um cenário. Não há campos de credenciais.
    const response = await fetch('/api/simulacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cenario: 'dados-ficticios' }),
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error('Falha na simulação.');
    const data = await response.json();
    result.textContent = JSON.stringify(data, null, 2);
    placeholder.hidden = true;
    result.hidden = false;
    reset.hidden = false;
    stepThree.classList.add('active');
    status.textContent = 'Concluído. O servidor devolveu um exemplo fixo; nada foi gravado.';
  } catch {
    stepTwo.classList.remove('active');
    status.classList.add('error');
    status.textContent = 'Não foi possível conectar. Inicie com node server.mjs e use o endereço 127.0.0.1 indicado no terminal.';
    simulate.disabled = false;
  }
});

reset.addEventListener('click', () => {
  result.textContent = '';
  result.hidden = true;
  placeholder.hidden = false;
  reset.hidden = true;
  simulate.disabled = false;
  stepTwo.classList.remove('active');
  stepThree.classList.remove('active');
  status.classList.remove('error');
  status.textContent = 'Pronto para explorar o cenário.';
  simulate.focus();
});
